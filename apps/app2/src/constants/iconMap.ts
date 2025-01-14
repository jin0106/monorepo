import { IconNamesEnum } from '@/constants/iconNames.enum'

export const IconMap: {
  [key in IconNamesEnum]: () => Promise<typeof import('*.svg')>
} = {
  [IconNamesEnum.Apple]: () => import(`@/icons/apple.svg`),
  [IconNamesEnum.ArrowDown]: () => import(`@/icons/arrow-down.svg`),
  [IconNamesEnum.ArrowLeft]: () => import(`@/icons/arrow-left.svg`),
  [IconNamesEnum.ArrowRight]: () => import(`@/icons/arrow-right.svg`),
  [IconNamesEnum.ArrowUp]: () => import(`@/icons/arrow-up.svg`),
  [IconNamesEnum.Basket]: () => import(`@/icons/basket.svg`),
  [IconNamesEnum.BellAlt]: () => import(`@/icons/bell-alt.svg`),
  [IconNamesEnum.CalendarPen]: () => import(`@/icons/calendar-pen.svg`),
  [IconNamesEnum.Camera]: () => import(`@/icons/camera.svg`),
  [IconNamesEnum.Card]: () => import(`@/icons/card.svg`),
  [IconNamesEnum.CheckFalseHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/check-false-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.CheckFalseHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/check-false-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.CheckFalseHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/check-false-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.CheckFalseHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/check-false-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.CheckTrueHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/check-true-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.CheckTrueHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/check-true-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.CheckTrueHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/check-true-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.CheckTrueHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/check-true-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.Check]: () => import(`@/icons/check.svg`),
  [IconNamesEnum.ChevronDown]: () => import(`@/icons/chevron-down.svg`),
  [IconNamesEnum.ChevronLeft]: () => import(`@/icons/chevron-left.svg`),
  [IconNamesEnum.ChevronRight]: () => import(`@/icons/chevron-right.svg`),
  [IconNamesEnum.ChevronUp]: () => import(`@/icons/chevron-up.svg`),
  [IconNamesEnum.CircleQuestion]: () => import(`@/icons/circle-question.svg`),
  [IconNamesEnum.Cloche]: () => import(`@/icons/cloche.svg`),
  [IconNamesEnum.Clock]: () => import(`@/icons/clock.svg`),
  [IconNamesEnum.CloseSmall]: () => import(`@/icons/close-small.svg`),
  [IconNamesEnum.Close]: () => import(`@/icons/close.svg`),
  [IconNamesEnum.Coins]: () => import(`@/icons/coins.svg`),
  [IconNamesEnum.Crosshair]: () => import(`@/icons/crosshair.svg`),
  [IconNamesEnum.Delete]: () => import(`@/icons/delete.svg`),
  [IconNamesEnum.Download]: () => import(`@/icons/download.svg`),
  [IconNamesEnum.FileList]: () => import(`@/icons/file-list.svg`),
  [IconNamesEnum.HomeFilledFalse]: () => import(`@/icons/home-filled-false.svg`),
  [IconNamesEnum.HomeFilledTrue]: () => import(`@/icons/home-filled-true.svg`),
  [IconNamesEnum.Information]: () => import(`@/icons/information.svg`),
  [IconNamesEnum.Kakao]: () => import(`@/icons/kakao.svg`),
  [IconNamesEnum.LocationFilledFalse]: () => import(`@/icons/location-filled-false.svg`),
  [IconNamesEnum.LocationFilledTrue]: () => import(`@/icons/location-filled-true.svg`),
  [IconNamesEnum.Minus]: () => import(`@/icons/minus.svg`),
  [IconNamesEnum.OrderListFilledFalse]: () => import(`@/icons/order-list-filled-false.svg`),
  [IconNamesEnum.OrderListFilledTrue]: () => import(`@/icons/order-list-filled-true.svg`),
  [IconNamesEnum.Pen]: () => import(`@/icons/pen.svg`),
  [IconNamesEnum.Phone]: () => import(`@/icons/phone.svg`),
  [IconNamesEnum.Plus]: () => import(`@/icons/plus.svg`),
  [IconNamesEnum.QrScan]: () => import(`@/icons/qr-scan.svg`),
  [IconNamesEnum.RadioFalseHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/radio-false-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RadioFalseHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/radio-false-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.RadioFalseHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/radio-false-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.RadioFalseHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/radio-false-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RadioTrueHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/radio-true-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RadioTrueHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/radio-true-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.RadioTrueHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/radio-true-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.RadioTrueHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/radio-true-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RefreshAll]: () => import(`@/icons/refresh-all.svg`),
  [IconNamesEnum.Refresh]: () => import(`@/icons/refresh.svg`),
  [IconNamesEnum.RoundCheckFalseHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/round-check-false-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RoundCheckFalseHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/round-check-false-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.RoundCheckFalseHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/round-check-false-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.RoundCheckFalseHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/round-check-false-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RoundCheckTrueHoverFalsePressedFalseDisabledFalse]: () =>
    import(`@/icons/round-check-true-hover-false-pressed-false-disabled-false.svg`),
  [IconNamesEnum.RoundCheckTrueHoverFalsePressedFalseDisabledTrue]: () =>
    import(`@/icons/round-check-true-hover-false-pressed-false-disabled-true.svg`),
  [IconNamesEnum.RoundCheckTrueHoverFalsePressedTrueDisabledFalse]: () =>
    import(`@/icons/round-check-true-hover-false-pressed-true-disabled-false.svg`),
  [IconNamesEnum.RoundCheckTrueHoverTruePressedFalseDisabledFalse]: () =>
    import(`@/icons/round-check-true-hover-true-pressed-false-disabled-false.svg`),
  [IconNamesEnum.Search]: () => import(`@/icons/search.svg`),
  [IconNamesEnum.SmileFilledFalse]: () => import(`@/icons/smile-filled-false.svg`),
  [IconNamesEnum.SmileFilledTrue]: () => import(`@/icons/smile-filled-true.svg`),
  [IconNamesEnum.SwitchVertical]: () => import(`@/icons/switch-vertical.svg`),
  [IconNamesEnum.Trash]: () => import(`@/icons/trash.svg`),
  [IconNamesEnum.UnionThreeBar]: () => import(`@/icons/union-three-bar.svg`)
}
