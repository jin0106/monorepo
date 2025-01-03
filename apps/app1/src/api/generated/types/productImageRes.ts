/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

/**
 * Returns a dictionary of urls corresponding to self.sizes
- `image_instance`: A VersatileImageFieldFile instance
- `self.sizes`: An iterable of 2-tuples, both strings. Example:
[
    ('large', 'url'),
    ('medium', 'crop__400x400'),
    ('small', 'thumbnail__100x100')
]

The above would lead to the following response:
{
    'large': 'http://some.url/image.jpg',
    'medium': 'http://some.url/__sized__/image-crop-400x400.jpg',
    'small': 'http://some.url/__sized__/image-thumbnail-100x100.jpg',
}
 */
export interface ProductImageRes {
  /** 원본 이미지 */
  readonly fullSize: string | null
  /** 메뉴 상단 이미지 */
  readonly menuMain: string | null
  /** 대표 메뉴 이미지 */
  readonly topMenu: string | null
  /** 메뉴 리스트 이미지 */
  readonly middleMenu: string | null
}