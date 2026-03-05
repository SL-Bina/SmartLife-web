/**
 * useAppColor – unified color hook.
 * Dashboard/admin users  →  MTK color  (useMtkColor)
 * Resident users         →  Complex color (useComplexColor)
 *
 * Returns the same interface as useMtkColor so any component can use it
 * without knowing which user type is active.
 */
import { useSelector } from 'react-redux';
import { useComplexColor } from '@/hooks/useComplexColor';
import { useMtkColor } from '@/store/hooks/useMtkColor';

const hexToRgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(220,38,38,${opacity})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

export function useAppColor() {
  const isResident = useSelector((s) => s.auth.user?.is_resident === true);

  // Always call both hooks (rules of hooks – no conditional calls)
  const complexColorData = useComplexColor();
  const mtkColorData     = useMtkColor();

  if (isResident) {
    const color = complexColorData.color;
    return {
      color,
      colorCode: color,
      getRgba:           (opacity = 1) => hexToRgba(color, opacity),
      headerStyle:       complexColorData.headerStyle,
      modalHeaderStyle:  complexColorData.modalHeaderStyle,
      getActiveGradient: (o1 = 0.9, o2 = 0.7) =>
        `linear-gradient(to right, ${hexToRgba(color, o1)}, ${hexToRgba(color, o2)})`,
      getHoverColor:    (o = 0.1) => hexToRgba(color, o),
      getSelectedColor: (o = 0.25) => hexToRgba(color, o),
    };
  }

  const color = mtkColorData.colorCode;
  return {
    color,
    colorCode: color,
    getRgba:           (opacity = 1) => hexToRgba(color, opacity),
    headerStyle: {
      background: `linear-gradient(135deg, ${hexToRgba(color, 1)}, ${hexToRgba(color, 0.8)})`,
      borderColor: hexToRgba(color, 0.5),
    },
    modalHeaderStyle: {
      background: `linear-gradient(135deg, ${hexToRgba(color, 0.15)}, ${hexToRgba(color, 0.08)})`,
      borderColor: hexToRgba(color, 0.25),
    },
    getActiveGradient: (o1 = 0.9, o2 = 0.7) =>
      mtkColorData.getActiveGradient(o1, o2),
    getHoverColor:    mtkColorData.getHoverColor,
    getSelectedColor: mtkColorData.getSelectedColor,
  };
}

export default useAppColor;
