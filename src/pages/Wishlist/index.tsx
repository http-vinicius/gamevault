import * as React from 'react'
import { Header } from '../../components/Layout/Header'
import { WishlistHeader } from '../../components/Wishlist/WishlistHeader'
import { WishlistFilters } from '../../components/Wishlist/WishlistFilters'
import { WishlistGrid } from '../../components/Wishlist/WishlistGrid'
import { WishlistGameDialog } from '../../components/Wishlist/WishlistGameDialog'
import { AddWishlistGameDialog } from '../../components/Wishlist/AddWishlistGameDialog'
import { useWishlist } from '../../hooks/useWishlist'
import { useVault } from '../../hooks/useVault'
import { WishlistGame } from '../../types'
import { WishlistGameFormData } from '../../schemas'

export function WishlistPage() {
  const {
    wishlist,
    isLoading,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    totalReserved,
    addWishlistGame,
    updateWishlistGame,
    deleteWishlistGame,
    reserveFunds,
    moveToLibrary,
  } = useWishlist()

  const { vaultData } = useVault()
  const freeBalance = vaultData?.freeBalance ?? 0

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false)
  const [itemToEdit, setItemToEdit] = React.useState<WishlistGame | null>(null)

  const [activeActionItem, setActiveActionItem] = React.useState<WishlistGame | null>(null)
  const [actionDialogMode, setActionDialogMode] = React.useState<'reserve' | 'buy' | null>(null)

  const handleOpenAdd = () => {
    setItemToEdit(null)
    setIsAddEditDialogOpen(true)
  }

  const handleOpenEdit = (item: WishlistGame) => {
    setItemToEdit(item)
    setIsAddEditDialogOpen(true)
  }

  const handleOpenReserve = (item: WishlistGame) => {
    setActiveActionItem(item)
    setActionDialogMode('reserve')
  }

  const handleOpenBuy = (item: WishlistGame) => {
    setActiveActionItem(item)
    setActionDialogMode('buy')
  }

  const handleSubmitWish = async (formData: WishlistGameFormData) => {
    if (itemToEdit) {
      await updateWishlistGame({ id: itemToEdit.id, data: formData })
    } else {
      await addWishlistGame(formData)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja remover este item da sua Wishlist?')) {
      await deleteWishlistGame(id)
    }
  }

  const handleConfirmReserve = async (amount: number) => {
    if (!activeActionItem) return
    await reserveFunds({ id: activeActionItem.id, amount })
  }

  const handleConfirmBuy = async (purchasePrice: number, status: 'backlog' | 'playing') => {
    if (!activeActionItem) return
    await moveToLibrary({ id: activeActionItem.id, purchasePrice, initialStatus: status })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Wishlist Gamer"
        subtitle="Gerencie desejos de compra, economias reservadas e preços promocionais."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <WishlistHeader
          totalCount={wishlist.length}
          totalReserved={totalReserved}
          onAddClick={handleOpenAdd}
        />

        <WishlistFilters
          search={search}
          onSearchChange={setSearch}
          selectedPriority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        <WishlistGrid
          items={wishlist}
          isLoading={isLoading}
          onReserve={handleOpenReserve}
          onMoveToLibrary={handleOpenBuy}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onAddWish={handleOpenAdd}
        />
      </div>

      {/* Action Dialog: Reserve money or Move to Library */}
      <WishlistGameDialog
        item={activeActionItem}
        mode={actionDialogMode}
        open={!!actionDialogMode}
        freeBalance={freeBalance}
        onOpenChange={(open) => !open && setActionDialogMode(null)}
        onConfirmReserve={handleConfirmReserve}
        onConfirmBuy={handleConfirmBuy}
      />

      {/* Add / Edit Dialog */}
      <AddWishlistGameDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        itemToEdit={itemToEdit}
        onSubmitWish={handleSubmitWish}
      />
    </div>
  )
}
