import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('🔴 Error Boundary Caught:', error);
        console.error('📍 Error Info:', errorInfo);

        // Update state with error details
        this.setState({
            error,
            errorInfo,
        });

        // TODO: Send to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const isDevelopment = import.meta.env.MODE === 'development';

            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-8 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                                <AlertTriangle className="text-white" size={40} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-rose-100 text-lg">
                                We encountered an unexpected error
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6">
                            <div className="text-center space-y-3">
                                <p className="text-slate-600 text-lg">
                                    Don't worry—this happens sometimes. Try reloading the page.
                                </p>
                                <p className="text-sm text-slate-500">
                                    If the problem persists, please contact support.
                                </p>
                            </div>

                            {/* Reload Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={this.handleReload}
                                    className="flex items-center gap-3 px-8 py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary-900/30 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <RefreshCw size={20} />
                                    Reload Page
                                </button>
                            </div>

                            {/* Development Mode: Show Error Details */}
                            {isDevelopment && this.state.error && (
                                <div className="mt-8 border-t border-slate-200 pt-6">
                                    <details className="group">
                                        <summary className="cursor-pointer text-sm font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2 select-none">
                                            <span className="text-amber-600">⚠️</span>
                                            Developer Details (Development Mode Only)
                                            <span className="text-slate-400 group-open:rotate-180 transition-transform">
                                                ▼
                                            </span>
                                        </summary>

                                        <div className="mt-4 space-y-4">
                                            {/* Error Message */}
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
                                                    Error Message
                                                </div>
                                                <pre className="text-sm text-red-800 font-mono overflow-x-auto">
                                                    {this.state.error.toString()}
                                                </pre>
                                            </div>

                                            {/* Component Stack */}
                                            {this.state.errorInfo?.componentStack && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                                                        Component Stack
                                                    </div>
                                                    <pre className="text-xs text-amber-900 font-mono overflow-x-auto whitespace-pre-wrap">
                                                        {this.state.errorInfo.componentStack}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Error Stack (if available) */}
                                            {this.state.error.stack && (
                                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                                                        Stack Trace
                                                    </div>
                                                    <pre className="text-xs text-slate-700 font-mono overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                                                        {this.state.error.stack}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            )}

                            {/* Production Mode: Hide Details */}
                            {!isDevelopment && (
                                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Error ID: {Date.now().toString(36).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Please share this ID with support if you need assistance.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
