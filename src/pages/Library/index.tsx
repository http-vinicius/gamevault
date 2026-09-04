import * as React from 'react'
import { Header } from '../../components/Layout/Header'
import { LibraryHeader } from '../../components/Library/LibraryHeader'
import { LibraryFilters } from '../../components/Library/LibraryFilters'
import { LibraryGrid } from '../../components/Library/LibraryGrid'
import { LibraryGameDetailsDialog } from '../../components/Library/LibraryGameDetailsDialog'
import { AddEditGameDialog } from '../../components/Library/AddEditGameDialog'
import { useLibrary } from '../../hooks/useLibrary'
import { LibraryGame } from '../../types'
import { LibraryGameFormData } from '../../schemas'

export function LibraryPage() {
  const {
    games,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    sortBy,
    setSortBy,
    countsByStatus,
    addGame,
    updateGame,
    deleteGame,
  } = useLibrary()

  // Modal dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false)
  const [gameToEdit, setGameToEdit] = React.useState<LibraryGame | null>(null)
  const [detailsGame, setDetailsGame] = React.useState<LibraryGame | null>(null)

  const handleOpenAdd = () => {
    setGameToEdit(null)
    setIsAddEditDialogOpen(true)
  }

  const handleOpenEdit = (game: LibraryGame) => {
    setGameToEdit(game)
    setIsAddEditDialogOpen(true)
  }

  const handleViewDetails = (game: LibraryGame) => {
    setDetailsGame(game)
  }

  const handleSubmitGame = async (formData: LibraryGameFormData) => {
    if (gameToEdit) {
      await updateGame({ id: gameToEdit.id, data: formData })
    } else {
      await addGame(formData)
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este jogo da sua biblioteca?')) {
      await deleteGame(id)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Biblioteca de Jogos"
        subtitle="Controle seu backlog, jogos em andamento e conquistas zeradas."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <LibraryHeader totalCount={games.length} onAddClick={handleOpenAdd} />

        <LibraryFilters
          search={search}
          onSearchChange={setSearch}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          selectedPlatform={platformFilter}
          onPlatformChange={setPlatformFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          countsByStatus={countsByStatus}
        />

        <LibraryGrid
          games={games}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGame}
          onAddGame={handleOpenAdd}
        />
      </div>

      {/* Details Modal */}
      <LibraryGameDetailsDialog
        game={detailsGame}
        open={!!detailsGame}
        onOpenChange={(open) => !open && setDetailsGame(null)}
        onEdit={(game) => {
          setDetailsGame(null)
          handleOpenEdit(game)
        }}
      />

      {/* Add/Edit Modal */}
      <AddEditGameDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        gameToEdit={gameToEdit}
        onSubmitGame={handleSubmitGame}
      />
    </div>
  )
}
