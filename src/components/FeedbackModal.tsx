'use client'

import { useState } from 'react'
import { X, Star, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  txHash: string
  transactionType: 'deposit' | 'withdraw'
  onSubmit: (rating?: number, comment?: string) => Promise<void>
}

export default function FeedbackModal({
  isOpen,
  onClose,
  txHash,
  transactionType,
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(rating * 20, comment) // Convert 1-5 stars to 0-100 scale
      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
        // Reset state after closing
        setTimeout(() => {
          setRating(5)
          setComment('')
          setIsSubmitted(false)
        }, 300)
      }, 2000)
    } catch (error) {
      console.error('Feedback submission error:', error)
      // Still close modal even if submission fails
      setTimeout(() => {
        onClose()
        setTimeout(() => {
          setRating(5)
          setComment('')
          setIsSubmitted(false)
        }, 300)
      }, 1000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    // Submit with default rating (95 = ~5 stars)
    onSubmit(95).then(() => {
      onClose()
      setTimeout(() => {
        setRating(5)
        setComment('')
        setIsSubmitted(false)
      }, 300)
    }).catch(() => {
      onClose()
      setTimeout(() => {
        setRating(5)
        setComment('')
        setIsSubmitted(false)
      }, 300)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1d] border border-white/10 rounded-lg p-6 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          disabled={isSubmitting || isSubmitted}
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          // Success state
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-white/70 text-sm">
              Your feedback has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Transaction Successful! 🎉
              </h3>
              <p className="text-white/70 text-sm">
                Your {transactionType} has been completed. Help us improve by sharing your experience.
              </p>
            </div>

            {/* Transaction Hash */}
            <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Transaction Hash:</p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://celoscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2BA3FF] hover:text-[#1a8fdb] underline text-xs font-mono break-all flex items-center gap-1"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">
                How would you rate your experience?
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    className={`transition-all ${
                      star <= rating
                        ? 'text-yellow-400 scale-110'
                        : 'text-white/30 hover:text-white/50'
                    } ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment (optional) */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">
                Additional feedback (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think..."
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#2BA3FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#2BA3FF] text-white rounded-lg hover:bg-[#1a8fdb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
