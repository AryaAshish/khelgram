import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminRegistrations } from '@/hooks/useAdminRegistrations'
import { useExportRegistrations } from '@/hooks/useExportRegistrations'
import { useGames } from '@/hooks/useGames'
import type { RegistrationFilters, RegistrationStatus } from '@/types/app.types'

const statusOptions: Array<RegistrationStatus | ''> = ['', 'confirmed', 'waitlisted', 'cancelled']

export function RegistrationsPage() {
  const [search, setSearch] = useState('')
  const [gameId, setGameId] = useState('')
  const [status, setStatus] = useState<RegistrationStatus | ''>('')

  const filters = useMemo<RegistrationFilters>(
    () => ({
      search,
      gameId: gameId || undefined,
      status: status || undefined,
    }),
    [search, gameId, status],
  )

  const { games } = useGames()
  const { registrations, isLoading } = useAdminRegistrations(filters)
  const exportRegistrations = useExportRegistrations(filters)

  return (
    <section aria-label="Admin registrations">
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
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Khel 2026 Registrations</h2>
        <Button
          onClick={() => exportRegistrations.mutate()}
          disabled={exportRegistrations.isPending}
        >
          {exportRegistrations.isPending ? 'Exporting...' : 'Export .xlsx'}
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <Label htmlFor="registration-search">Search</Label>
          <Input
            id="registration-search"
            placeholder="Name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="registration-game-filter">Game</Label>
          <select
            id="registration-game-filter"
            value={gameId}
            onChange={(event) => setGameId(event.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
            }}
          >
            <option value="">All games</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="registration-status-filter">Status</Label>
          <select
            id="registration-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value as RegistrationStatus | '')}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
            }}
          >
            {statusOptions.map((option) => (
              <option key={option || 'all'} value={option}>
                {option ? option : 'All statuses'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? <p>Loading registrations...</p> : null}

      {!isLoading && registrations.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No registrations match the current filters.</p>
      ) : null}

      {!isLoading && registrations.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem' }}>Code</th>
                <th style={{ padding: '0.75rem' }}>Child</th>
                <th style={{ padding: '0.75rem' }}>Age</th>
                <th style={{ padding: '0.75rem' }}>Games</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <Link to={`/admin/registrations/${registration.id}`}>{registration.code}</Link>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{registration.childName}</td>
                  <td style={{ padding: '0.75rem' }}>{registration.age}</td>
                  <td style={{ padding: '0.75rem' }}>{registration.gameNames.join(', ')}</td>
                  <td style={{ padding: '0.75rem' }}>{registration.status}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
