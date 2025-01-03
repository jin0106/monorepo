import { BodyType } from '@/api/mutator/custom-instance'

/**
 * axios에서 Content-Type을 multiformData로 명시한 경우 자동으로 body값을 직렬화해줍니다.
 * form 데이터 안의 값이 직렬화 되지 않아 백엔드에서 파싱이 불가능 한경우가 있어 아래와 같이 수정합니다.
 * @link https://github.com/axios/axios#-automatic-serialization-to-formdata
 */

export const customFormData = <T = unknown>(body: BodyType<T>): BodyType<T> => {
  return body
}

export default customFormData
