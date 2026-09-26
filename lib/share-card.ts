import { RefObject } from 'react'

/**
 * Renders the element referenced by `elementRef` to a PNG data URL using
 * html2canvas. Returns an empty string on failure (never throws).
 */
export async function exportShareCardAsPng(
  elementRef: RefObject<HTMLElement>
): Promise<string> {
  if (!elementRef.current) {
    console.error('[share-card] exportShareCardAsPng: ref is null')
    return ''
  }
  try {
    // Dynamic import — html2canvas is client-only
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(elementRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 2, // retina-quality output
      logging: false,
    })
    return canvas.toDataURL('image/png')
  } catch (err) {
    console.error('[share-card] html2canvas failed:', err)
    return ''
  }
}

/**
 * Triggers a browser file download for the given data URL.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  if (!dataUrl) return
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
