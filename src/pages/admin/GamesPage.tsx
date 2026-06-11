import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCapacityPercent } from '@/lib/gameRegistration.logic'
import { gameIconOptions } from '@/lib/gameIcons'
import {
  useAdminGames,
  useCloseGame,
  useDeleteGame,
  useOpenGame,
  useUpsertGame,
} from '@/hooks/useAdminGames'
import { useAdminCreateRegistration } from '@/hooks/useAdminRegistrations'
import type { Game, GameInput } from '@/types/app.types'

const emptyGameForm: GameInput = {
  name: '',
  description: '',
  ageGroup: '',
  startTime: '',
  capacity: undefined,
  icon: '',
  preRegistrationAllowed: true,
  status: 'active',
}

export function GamesPage() {
  const { data: games = [], isLoading } = useAdminGames()
  const upsertGame = useUpsertGame()
  const deleteGame = useDeleteGame()
  const openGame = useOpenGame()
  const closeGame = useCloseGame()
  const adminCreateRegistration = useAdminCreateRegistration()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<GameInput>(emptyGameForm)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [manualRegistration, setManualRegistration] = useState({
    childName: '',
    age: '',
    parentName: '',
    email: '',
    phone: '',
    selectedGameId: '',
  })

  const isPending =
    upsertGame.isPending ||
    deleteGame.isPending ||
    openGame.isPending ||
    closeGame.isPending ||
    adminCreateRegistration.isPending

  const editingGame = useMemo(
    () => games.find((game) => game.id === editingId) ?? null,
    [editingId, games],
  )

  const startEdit = (game: Game) => {
    setIsAdding(false)
    setEditingId(game.id)
    setForm({
      id: game.id,
      slug: game.slug,
      name: game.name,
      description: game.description,
      ageGroup: game.ageGroup,
      startTime: game.startTime,
      capacity: game.capacity,
      icon: game.icon ?? '',
      preRegistrationAllowed: game.preRegistrationAllowed ?? true,
      status: game.status,
    })
  }

  const startAdd = () => {
    setEditingId(null)
    setIsAdding(true)
    setForm(emptyGameForm)
  }

  const handleSaveGame = async () => {
    await upsertGame.mutateAsync({
      ...form,
      capacity:
        form.capacity === undefined || Number.isNaN(Number(form.capacity))
          ? undefined
          : Number(form.capacity),
    })
    setEditingId(null)
    setIsAdding(false)
    setForm(emptyGameForm)
  }

  const handleManualRegistration = async () => {
    const game = games.find((entry) => entry.id === manualRegistration.selectedGameId)
    if (!game) {
      return
    }

    await adminCreateRegistration.mutateAsync({
      childName: manualRegistration.childName,
      age: manualRegistration.age,
      parentName: manualRegistration.parentName,
      email: manualRegistration.email,
      phone: manualRegistration.phone,
      selectedEvents: [game.name],
    })

    setManualRegistration({
      childName: '',
      age: '',
      parentName: '',
      email: '',
      phone: '',
      selectedGameId: manualRegistration.selectedGameId,
    })
  }

  const showForm = isAdding || editingId !== null

  return (
    <section aria-label="Games management">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Games</h2>
        <Button onClick={startAdd} disabled={isPending}>
          Add game
        </Button>
      </div>

      {isLoading ? <p>Loading games...</p> : null}

      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}
              >
                Game
              </th>
              <th
                style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}
              >
                Capacity
              </th>
              <th
                style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}
              >
                Status
              </th>
              <th
                style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const capacityPercent = getCapacityPercent(game)
              return (
                <tr key={game.id}>
                  <td style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <strong>{game.name}</strong>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {game.ageGroup} • {game.startTime}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    {game.capacity !== undefined ? (
                      <div style={{ minWidth: '140px' }}>
                        <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          {game.registeredCount ?? 0} / {game.capacity}
                        </div>
                        {capacityPercent !== null ? (
                          <div
                            style={{
                              height: '0.4rem',
                              borderRadius: '999px',
                              background: '#e5e7eb',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${capacityPercent}%`,
                                height: '100%',
                                background: '#22c55e',
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      'Unlimited'
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: game.status === 'active' ? '#047857' : '#6b7280',
                      }}
                    >
                      {game.status === 'active' ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        variant="outline"
                        onClick={() => startEdit(game)}
                        disabled={isPending}
                      >
                        Edit
                      </Button>
                      {game.status === 'active' ? (
                        <Button
                          variant="outline"
                          onClick={() => closeGame.mutate(game.id)}
                          disabled={isPending}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => openGame.mutate(game.id)}
                          disabled={isPending}
                        >
                          Open
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setPendingDeleteId(game.id)}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm ? (
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            maxWidth: '720px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>{editingGame ? `Edit ${editingGame.name}` : 'Add game'}</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <Label htmlFor="game-name">Name</Label>
              <Input
                id="game-name"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="game-description">Description</Label>
              <textarea
                id="game-description"
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, description: event.target.value }))
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
            <div>
              <Label htmlFor="game-age-group">Age group</Label>
              <Input
                id="game-age-group"
                value={form.ageGroup}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, ageGroup: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="game-start-time">Start time</Label>
              <Input
                id="game-start-time"
                value={form.startTime}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, startTime: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="game-capacity">Capacity</Label>
              <Input
                id="game-capacity"
                type="number"
                min={0}
                value={form.capacity ?? ''}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    capacity: event.target.value === '' ? undefined : Number(event.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="game-icon">Icon</Label>
              <select
                id="game-icon"
                value={form.icon ?? ''}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, icon: event.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                }}
              >
                {gameIconOptions.map((option) => (
                  <option key={option.value || 'none'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.preRegistrationAllowed ?? true}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    preRegistrationAllowed: event.target.checked,
                  }))
                }
              />
              Allow during pre-registration
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button onClick={() => void handleSaveGame()} disabled={isPending}>
                {upsertGame.isPending ? 'Saving...' : 'Save game'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setIsAdding(false)
                  setForm(emptyGameForm)
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDeleteId ? (
        <div
          style={{
            border: '1px solid #fecaca',
            background: '#fef2f2',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            maxWidth: '480px',
          }}
        >
          <p style={{ marginTop: 0 }}>Delete this game permanently?</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={() => {
                void deleteGame.mutateAsync(pendingDeleteId).then(() => setPendingDeleteId(null))
              }}
              disabled={deleteGame.isPending}
            >
              Confirm delete
            </Button>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1rem',
          maxWidth: '720px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Manual registration entry</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <Label htmlFor="manual-game">Game</Label>
            <select
              id="manual-game"
              value={manualRegistration.selectedGameId}
              onChange={(event) =>
                setManualRegistration((previous) => ({
                  ...previous,
                  selectedGameId: event.target.value,
                }))
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
              }}
            >
              <option value="">Select a game</option>
              {games
                .filter((game) => game.status === 'active')
                .map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <Label htmlFor="manual-child-name">Child name</Label>
            <Input
              id="manual-child-name"
              value={manualRegistration.childName}
              onChange={(event) =>
                setManualRegistration((previous) => ({
                  ...previous,
                  childName: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="manual-age">Age</Label>
            <Input
              id="manual-age"
              value={manualRegistration.age}
              onChange={(event) =>
                setManualRegistration((previous) => ({ ...previous, age: event.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="manual-parent-name">Parent name</Label>
            <Input
              id="manual-parent-name"
              value={manualRegistration.parentName}
              onChange={(event) =>
                setManualRegistration((previous) => ({
                  ...previous,
                  parentName: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="manual-email">Email</Label>
            <Input
              id="manual-email"
              type="email"
              value={manualRegistration.email}
              onChange={(event) =>
                setManualRegistration((previous) => ({ ...previous, email: event.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="manual-phone">Phone</Label>
            <Input
              id="manual-phone"
              value={manualRegistration.phone}
              onChange={(event) =>
                setManualRegistration((previous) => ({ ...previous, phone: event.target.value }))
              }
            />
          </div>
          <Button onClick={() => void handleManualRegistration()} disabled={isPending}>
            {adminCreateRegistration.isPending ? 'Saving...' : 'Add registration'}
          </Button>
        </div>
      </div>
    </section>
  )
}
