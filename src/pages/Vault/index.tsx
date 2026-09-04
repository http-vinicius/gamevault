import * as React from 'react'
import { Header } from '../../components/Layout/Header'
import { VaultBalancesHeader } from '../../components/Vault/VaultBalancesHeader'
import { MonthlyGoalCard } from '../../components/Vault/MonthlyGoalCard'
import { VaultDepositDialog } from '../../components/Vault/VaultDepositDialog'
import { EditGoalDialog } from '../../components/Vault/EditGoalDialog'
import { TransactionHistoryList } from '../../components/Vault/TransactionHistoryList'
import { useVault } from '../../hooks/useVault'
import { useWishlist } from '../../hooks/useWishlist'
import { MonthlyGoalFormData } from '../../schemas'

export function VaultPage() {
  const {
    vaultData,
    transactions,
    monthlyGoal,
    isLoading,
    deposit,
    reserveForGame,
    updateMonthlyGoal,
  } = useVault()

  const { wishlist } = useWishlist()

  // Modal dialog states
  const [isDepositOpen, setIsDepositOpen] = React.useState(false)
  const [depositDestination, setDepositDestination] = React.useState<'free' | 'game' | 'monthly_goal'>('free')
  const [isEditGoalOpen, setIsEditGoalOpen] = React.useState(false)

  const handleOpenFreeDeposit = () => {
    setDepositDestination('free')
    setIsDepositOpen(true)
  }

  const handleOpenGoalDeposit = () => {
    setDepositDestination('monthly_goal')
    setIsDepositOpen(true)
  }

  const handleDepositSubmit = async (data: {
    amount: number
    destination: 'free' | 'game' | 'monthly_goal'
    gameId?: string
    description?: string
  }) => {
    if (data.destination === 'game' && data.gameId) {
      await reserveForGame({
        gameId: data.gameId,
        amount: data.amount,
        description: data.description,
      })
    } else {
      await deposit({
        amount: data.amount,
        destination: data.destination,
        description: data.description,
      })
    }
  }

  const handleEditGoalSubmit = async (data: MonthlyGoalFormData) => {
    await updateMonthlyGoal(data)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Cofre Gamer"
        subtitle="Gerenciamento financeiro pessoal para seus jogos, metas e reservas."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Balances Banner */}
        <VaultBalancesHeader
          totalVaultBalance={vaultData?.totalVaultBalance ?? 1285}
          reservedForGames={vaultData?.reservedForGames ?? 950}
          freeBalance={vaultData?.freeBalance ?? 335}
          onOpenDeposit={handleOpenFreeDeposit}
        />

        {/* Monthly Goal Card */}
        <MonthlyGoalCard
          goal={monthlyGoal}
          onEditGoal={() => setIsEditGoalOpen(true)}
          onAddFundsToGoal={handleOpenGoalDeposit}
        />

        {/* Transactions History */}
        <TransactionHistoryList transactions={transactions} />
      </div>

      {/* Deposit Dialog */}
      <VaultDepositDialog
        open={isDepositOpen}
        onOpenChange={setIsDepositOpen}
        wishlistGames={wishlist}
        currentGoal={monthlyGoal}
        defaultDestination={depositDestination}
        onSubmitDeposit={handleDepositSubmit}
      />

      {/* Edit Goal Dialog */}
      <EditGoalDialog
        open={isEditGoalOpen}
        onOpenChange={setIsEditGoalOpen}
        currentGoal={monthlyGoal}
        onSubmitGoal={handleEditGoalSubmit}
      />
    </div>
  )
}
