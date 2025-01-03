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
export interface ShopImageRes {
  /** 원본 이미지 */
  readonly fullSize: string | null
  /** 가게 상단 이미지 */
  readonly shopMain: string | null
  /** 주문 상세 썸네일 이미지 */
  readonly orderShop: string | null
  /** 가게리스트 썸네일 이미지 */
  readonly shopList: string | null
}
