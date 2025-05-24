import useHeaderTheme from "@/hooks/useHeaderTheme";



export default function useViewModel() {
   const {theme,tintColor, headerBgColors,} = useHeaderTheme()
  return {
    data:[]
  }
}
