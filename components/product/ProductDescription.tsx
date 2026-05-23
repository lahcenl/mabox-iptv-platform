import MarkdownPreview from '@uiw/react-markdown-preview';

interface ProductDescriptionProps {
  description: string;
}

/**
 * Renders the product description as rich Markdown HTML.
 *
 * Placed at the very bottom of the product page — completely below the
 * product image, pricing tiers, and add-to-cart / WhatsApp buttons.
 *
 * @uiw/react-markdown-preview safely escapes raw HTML by default,
 * preventing XSS while correctly rendering H2/H3 headings, bold text,
 * and bullet/numbered lists for both users and search engines.
 */
export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description?.trim()) return null;

  return (
    <section
      aria-label="Product description"
      className="product-description-section bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 mt-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span
          className="inline-block w-1 h-6 rounded-full bg-violet-600"
          aria-hidden="true"
        />
        About This Product
      </h2>

      {/* data-color-mode="light" forces the preview to always use light theme */}
      <div data-color-mode="light" className="markdown-body-custom">
        <MarkdownPreview
          source={description}
          style={{
            backgroundColor: 'transparent',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
          wrapperElement={
            { 'data-color-mode': 'light' } as React.HTMLAttributes<HTMLDivElement>
          }
        />
      </div>
    </section>
  );
}
