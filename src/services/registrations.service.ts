import { RegistrationError } from '@/lib/errors'
import {
  getOverallRegistrationStatus,
  resolveGameRegistrationStatuses as resolveStatuses,
} from '@/lib/gameRegistration.logic'
import * as gamesService from '@/services/games.service'
import { supabase } from '@/lib/supabase'
import type {
  AdminRegistration,
  Game,
  RegistrationFilters,
  RegistrationInput,
  RegistrationResult,
  RegistrationStatus,
} from '@/types/app.types'

type GameRegistrationStatus = 'confirmed' | 'waitlisted'

type CreateRegistrationPayload = RegistrationInput & {
  gameIds: string[]
  gameStatuses: Record<string, GameRegistrationStatus>
}

type RegistrationGameRow = {
  game_id: string
  status: string
  games: { name: string } | { name: string }[] | null
}

type RegistrationRow = {
  id: string
  code: string
  child_name: string
  age: number
  parent_name: string
  email: string
  phone: string
  status: string
  created_at: string
  registration_games: RegistrationGameRow[] | null
}

const registrationSelect = `
  id,
  code,
  child_name,
  age,
  parent_name,
  email,
  phone,
  status,
  created_at,
  registration_games (
    game_id,
    status,
    games ( name )
  )
`

function mapRegistrationError(message: string): RegistrationError {
  return new RegistrationError(message)
}

function getGameName(gameRelation: RegistrationGameRow['games']): string {
  if (!gameRelation) {
    return 'Unknown game'
  }

  if (Array.isArray(gameRelation)) {
    return gameRelation[0]?.name ?? 'Unknown game'
  }

  return gameRelation.name
}

function mapAdminRegistration(row: RegistrationRow): AdminRegistration {
  const games = row.registration_games ?? []

  return {
    id: row.id,
    code: row.code,
    childName: row.child_name,
    age: row.age,
    parentName: row.parent_name,
    email: row.email,
    phone: row.phone,
    status: row.status as RegistrationStatus,
    createdAt: row.created_at,
    gameNames: games.map((entry) => getGameName(entry.games)),
    gameIds: games.map((entry) => entry.game_id),
  }
}

export function filterRegistrations(
  registrations: AdminRegistration[],
  filters: RegistrationFilters,
): AdminRegistration[] {
  const search = filters.search?.trim().toLowerCase() ?? ''

  return registrations.filter((registration) => {
    const matchesSearch =
      search.length === 0 ||
      registration.childName.toLowerCase().includes(search) ||
      registration.email.toLowerCase().includes(search) ||
      registration.parentName.toLowerCase().includes(search)

    const matchesGame =
      !filters.gameId ||
      filters.gameId.length === 0 ||
      registration.gameIds.includes(filters.gameId)

    const matchesStatus =
      !filters.status || filters.status.length === 0 || registration.status === filters.status

    return matchesSearch && matchesGame && matchesStatus
  })
}

export async function checkDuplicate(email: string, gameId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_registration_duplicate', {
    p_email: email,
    p_game_id: gameId,
  })

  if (error) {
    throw mapRegistrationError(error.message)
  }

  return Boolean(data)
}

export async function getRegistrationCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_registration_count')

  if (error) {
    throw mapRegistrationError(error.message)
  }

  return typeof data === 'number' ? data : 0
}

export async function getRegistrations(): Promise<AdminRegistration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select(registrationSelect)
    .order('created_at', { ascending: false })

  if (error) {
    throw mapRegistrationError(error.message)
  }

  return (data as RegistrationRow[] | null)?.map(mapAdminRegistration) ?? []
}

export async function getRegistrationDetail(id: string): Promise<AdminRegistration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select(registrationSelect)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw mapRegistrationError(error.message)
  }

  if (!data) {
    return null
  }

  return mapAdminRegistration(data as RegistrationRow)
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<AdminRegistration> {
  const { data, error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id)
    .select(registrationSelect)
    .single()

  if (error || !data) {
    throw mapRegistrationError(error?.message ?? 'Unable to update registration status')
  }

  return mapAdminRegistration(data as RegistrationRow)
}

export function resolveGameRegistrationStatuses(
  games: Game[],
  gameIds: string[],
): Record<string, GameRegistrationStatus> {
  try {
    return resolveStatuses(games, gameIds)
  } catch (error) {
    throw mapRegistrationError(error instanceof Error ? error.message : 'Registration failed')
  }
}

/** @deprecated Use resolveGameRegistrationStatuses — full games now waitlist instead of blocking. */
export function assertCapacity(games: Game[], gameIds: string[]): void {
  resolveGameRegistrationStatuses(games, gameIds)
}

export async function createRegistration(
  payload: CreateRegistrationPayload,
): Promise<RegistrationResult> {
  const age = Number(payload.age)
  const overallStatus = getOverallRegistrationStatus(payload.gameStatuses)

  const { data: registration, error: registrationError } = await supabase
    .from('registrations')
    .insert({
      child_name: payload.childName,
      age,
      parent_name: payload.parentName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      status: overallStatus,
    })
    .select('id, code, status')
    .single()

  if (registrationError || !registration) {
    throw mapRegistrationError(registrationError?.message ?? 'Registration failed')
  }

  const registrationGames = payload.gameIds.map((gameId) => ({
    registration_id: registration.id,
    game_id: gameId,
    status: payload.gameStatuses[gameId] ?? 'confirmed',
  }))

  const { error: gamesError } = await supabase.from('registration_games').insert(registrationGames)

  if (gamesError) {
    throw mapRegistrationError(gamesError.message)
  }

  return {
    id: registration.id,
    code: registration.code,
    status: registration.status as RegistrationStatus,
  }
}

export async function promoteFromWaitlist(
  registrationId: string,
  gameId: string,
): Promise<AdminRegistration> {
  const game = await gamesService.getGameWithCapacity(gameId)

  if (!game) {
    throw mapRegistrationError('Game not found')
  }

  if (game.capacity !== undefined && (game.registeredCount ?? 0) >= game.capacity) {
    throw mapRegistrationError(`${game.name} is still at capacity.`)
  }

  const { error: gameUpdateError } = await supabase
    .from('registration_games')
    .update({ status: 'confirmed' })
    .eq('registration_id', registrationId)
    .eq('game_id', gameId)
    .eq('status', 'waitlisted')

  if (gameUpdateError) {
    throw mapRegistrationError(gameUpdateError.message)
  }

  const { data: waitlistedGames, error: waitlistError } = await supabase
    .from('registration_games')
    .select('status')
    .eq('registration_id', registrationId)
    .eq('status', 'waitlisted')

  if (waitlistError) {
    throw mapRegistrationError(waitlistError.message)
  }

  const nextRegistrationStatus = (waitlistedGames?.length ?? 0) > 0 ? 'waitlisted' : 'confirmed'

  return updateRegistrationStatus(registrationId, nextRegistrationStatus)
}

type SendRegistrationEmailResponse = {
  ok?: boolean
  error?: string
}

export async function resendConfirmation(registrationId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<SendRegistrationEmailResponse>(
    'send-registration-email',
    {
      body: { registrationId },
    },
  )

  if (error) {
    throw mapRegistrationError(error.message)
  }

  if (!data?.ok) {
    throw mapRegistrationError(data?.error ?? 'Unable to send confirmation email')
  }
}
