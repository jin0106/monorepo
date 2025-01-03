import {
  FieldPath,
  FieldValues,
  UseFormReturn,
  UseFormProps as UseHookFormProps,
  useForm as useFormHookForm
} from 'react-hook-form'

/**
 * form에 컴포넌트를 등록하는 함수
 * validation, onChange에서 value 타입 추론을 하기 위해서 필요함
 * @example
 * import useForm from '@/hooks/form/useForm'
 *
 * const { registers: { regi }, ...methods } = useForm<TestFormProps>();
 * <Form<TestFormProps> methods={methods}>
 *     <TextInput
 *         {...regi("text")}
 *         validate={(value, formValues) => {
 *             console.log("validate, value", value, "formValues", formValues);
 *             return true;
 *         }}
 *         title="타이틀"
 *         label={{ title: "라벨!!" }}
 *         required="입력해주세요"
 *         onChange={value => console.log("value", value, typeof value)}
 *     />
 * </>
 */
type RegiType<TFieldValues extends FieldValues = FieldValues, TContext = unknown> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  /**
   * form interface에서 해당 컴포넌트가 사용하는 이름
   */
  name: TFieldName
) => {
  name: TFieldName
  formControlMethods: UseFormReturn<TFieldValues, TContext>
}

/**
 * form에 DateRange 컴포넌트를 등록하는 함수. *미구현*
 * validation, onChange에서 value 타입 추론을 하기 위해서 필요함
 * @example
 * import useForm from '@/hooks/form/useForm'
 *
 * const { registers: { regiDateRange }, ...methods } = useForm<TestFormProps>();
 * <Form<TestFormProps> methods={methods}>
 *     <DateTimeRangeInput
 *         {...regiDateRange(["openAt", "closeAt"])}
 *         title="테스트 Range"
 *         placeholder="입력입력!"
 *         validate={(v, fv) => {
 *             console.log("v", v, "fv", fv);
 *             return true;
 *         }}
 *         onChange={(values) => console.log("onChange", "values", values)}
 *     />
 * </>
 */
type RegiDateRangeType<TFieldValues extends FieldValues = FieldValues, TContext = unknown> = <
  TFieldNameStart extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldNameEnd extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  /**
   * form interface에서 해당 컴포넌트가 사용하는 이름
   * [시작 이름, 종료 이름]
   */
  names: [TFieldNameStart, TFieldNameEnd]
) => {
  names: [TFieldNameStart, TFieldNameEnd]
  formControlMethods: UseFormReturn<TFieldValues, TContext>
}

type UseFormProps<TFieldValues extends FieldValues> = UseHookFormProps<TFieldValues>

/**
 * useForm의 return type
 */
export interface FormControlType<TFieldValues extends FieldValues = FieldValues, TContext = unknown>
  extends UseFormReturn<TFieldValues, TContext> {
  registers: {
    regi: RegiType<TFieldValues, TContext>
    regiDateRange: RegiDateRangeType<TFieldValues, TContext>
  }
}

/**
 * react-hook-form의 useForm의 wrapping한 hook
 */
const useForm = <TFieldValues extends FieldValues = FieldValues, TContext = unknown>(
  props?: UseFormProps<TFieldValues>
): FormControlType<TFieldValues, TContext> => {
  const { mode = 'onChange', reValidateMode = 'onChange', criteriaMode = 'firstError', ...formProps } = props || {}
  const methods = useFormHookForm<TFieldValues, TContext>({
    mode,
    reValidateMode,
    criteriaMode,
    ...formProps
  })
  const regi: RegiType<TFieldValues, TContext> = (name) => {
    return { name, formControlMethods: methods }
  }

  const regiDateRange: RegiDateRangeType<TFieldValues, TContext> = (names) => {
    return { names, formControlMethods: methods }
  }

  return {
    registers: {
      regi,
      regiDateRange
    },
    ...methods
  }
}

export default useForm
