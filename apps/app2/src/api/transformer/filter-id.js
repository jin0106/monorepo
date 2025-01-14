/**
 * Transformer function for orval.
 *
 * @param {OpenAPIObject} schema
 * @return {OpenAPIObject}
 */
module.exports = (inputSchema) => {
  // 허용할 엔드포인트 및 스키마 지정, yaml 파일에서 operationId, schema 확인
  const enablePaths = ['sites_list', 'nodes_list']
  const enableSchemas = [
    'PaginatedSiteResList',
    'BottomSheetImageRes',
    'SiteRes',
    'SiteTypeEnum',
    'NodeRes',
    'SiteAvailableStatusEnum',
    'CurrencyEnum',
    'DeliveryTypesEnum'
  ]

  const paths = Object.entries(inputSchema.paths).reduce((acc, [path, pathItem]) => {
    const item = Object.entries(pathItem).reduce((pathItemAcc, [verb, operation]) => {
      if (enablePaths.includes(operation?.operationId)) {
        return {
          ...pathItemAcc,
          [verb]: operation
        }
      }
      return { ...pathItemAcc }
    }, {})
    return {
      ...acc,
      ...(Object.keys(item).length && { [path]: item })
    }
  }, {})
  const schemas = Object.entries(inputSchema.components.schemas).reduce((acc, [key, value]) => {
    if (enableSchemas.includes(key)) {
      return {
        ...acc,
        [key]: value
      }
    }
    return { ...acc }
  }, {})

  const result = {
    ...inputSchema,
    paths,
    components: {
      ...inputSchema.components,
      schemas
    }
  }
  return result
}
