import { X } from 'lucide-react';
import { MatchResult } from '../types';

interface CheckoutModalProps {
  selectedCandidates: MatchResult[];
  onClose: () => void;
  onCheckout: () => void;
}

const PRICE_PER_CANDIDATE = 10;

export function CheckoutModal({ selectedCandidates, onClose, onCheckout }: CheckoutModalProps) {
  const totalCost = selectedCandidates.length * PRICE_PER_CANDIDATE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Selected Candidates</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedCandidates.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    {result.candidate.first_name} {result.candidate.last_name}
                  </span>
                  <span className="text-slate-600 font-medium">S$ {PRICE_PER_CANDIDATE}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Subtotal ({selectedCandidates.length})</span>
              <span className="text-slate-900 font-medium">S$ {(selectedCandidates.length * PRICE_PER_CANDIDATE).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-3xl font-bold text-blue-600">S$ {totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
