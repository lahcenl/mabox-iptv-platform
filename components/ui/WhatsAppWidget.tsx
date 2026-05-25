'use client';

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contact support on WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
        Need Help? Chat with us! 💬
      </span>

      {/* Official WhatsApp SVG Logo */}
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.319 5.324.001 11.884 0c3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.322 11.878-11.882 11.879-2.001-.001-3.97-.504-5.714-1.464L0 24zm6.524-3.385l.412.245c1.472.873 3.103 1.332 4.775 1.333 5.485.002 9.948-4.461 9.95-9.95.002-2.659-1.031-5.158-2.908-7.037C16.883 3.327 14.387 2.296 11.73 2.295 6.245 2.296 1.782 6.759 1.78 12.244c-.001 1.75.459 3.454 1.33 4.96l.269.465-1.012 3.693 3.792-.994zM17.51 16.3c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      </svg>
    </a>
  );
}
