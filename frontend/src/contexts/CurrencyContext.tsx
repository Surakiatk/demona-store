import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { exchangeApi, ExchangeRate } from '../api/services'

type Currency = 'THB' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: ExchangeRate | null
  loading: boolean
  convertAmount: (amount: number, from?: Currency, to?: Currency) => number
  formatCurrency: (amount: number, showBoth?: boolean) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

interface CurrencyProviderProps {
  children: ReactNode
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('THB')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExchangeRate()
    // อัพเดทอัตราแลกเปลี่ยนทุก 1 ชั่วโมง
    const interval = setInterval(loadExchangeRate, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadExchangeRate = async () => {
    try {
      const response = await exchangeApi.getRate()
      setExchangeRate(response.data)
    } catch (error) {
      console.error('Error loading exchange rate:', error)
      // ใช้ค่า default ถ้า API ไม่ทำงาน
      setExchangeRate({
        thb_to_usd: 0.027,
        usd_to_thb: 36.5,
        last_updated: new Date().toISOString(),
        base_currency: 'THB',
        target_currency: 'USD',
      })
    } finally {
      setLoading(false)
    }
  }

  const convertAmount = (amount: number, from: Currency = 'THB', to?: Currency): number => {
    if (!exchangeRate) return amount
    const targetCurrency = to || currency
    if (from === targetCurrency) return amount

    if (from === 'THB' && targetCurrency === 'USD') {
      return amount * exchangeRate.thb_to_usd
    } else if (from === 'USD' && targetCurrency === 'THB') {
      return amount * exchangeRate.usd_to_thb
    }

    return amount
  }

  const formatCurrency = (amount: number, showBoth: boolean = false): string => {
    if (!exchangeRate) {
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
      }).format(amount)
    }

    // ข้อมูลในฐานข้อมูลเป็น THB เสมอ
    const displayAmount = currency === 'THB' ? amount : convertAmount(amount, 'THB', currency)
    const formatted = new Intl.NumberFormat(
      currency === 'THB' ? 'th-TH' : 'en-US',
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(displayAmount)

    if (showBoth && currency !== 'THB') {
      const thbAmount = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
      }).format(amount)
      return `${formatted} (${thbAmount})`
    }

    return formatted
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        loading,
        convertAmount,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

