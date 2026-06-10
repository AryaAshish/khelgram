import { RegistrationError } from '@/lib/errors'
import { supabase } from '@/lib/supabase'
import type { Game, RegistrationInput, RegistrationResult } from '@/types/app.types'

type CreateRegistrationPayload = RegistrationInput & {
  gameIds: string[]
}

function mapRegistrationError(message: string): RegistrationError {
  return new RegistrationError(message)
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

export function assertCapacity(games: Game[], gameIds: string[]): void {
  for (const gameId of gameIds) {
    const game = games.find((entry) => entry.id === gameId)
    if (!game) {
      throw mapRegistrationError('One or more selected events are no longer available.')
    }

    if (game.capacity !== undefined && (game.registeredCount ?? 0) >= game.capacity) {
      throw mapRegistrationError(`${game.name} is full. Please choose another event.`)
    }
  }
}

export async function createRegistration(
  payload: CreateRegistrationPayload,
): Promise<RegistrationResult> {
  const age = Number(payload.age)

  const { data: registration, error: registrationError } = await supabase
    .from('registrations')
    .insert({
      child_name: payload.childName,
      age,
      parent_name: payload.parentName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
    })
    .select('id, code')
    .single()

  if (registrationError || !registration) {
    throw mapRegistrationError(registrationError?.message ?? 'Registration failed')
  }

  const registrationGames = payload.gameIds.map((gameId) => ({
    registration_id: registration.id,
    game_id: gameId,
    status: 'confirmed',
  }))

  const { error: gamesError } = await supabase.from('registration_games').insert(registrationGames)

  if (gamesError) {
    throw mapRegistrationError(gamesError.message)
  }

  return {
    id: registration.id,
    code: registration.code,
  }
}
