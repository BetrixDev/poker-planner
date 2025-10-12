export function getDefaultUserProfileImage(id: string) {
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(
    id
  )}&backgroundType=gradientLinear&backgroundColor=d1d4f9,ffd5dc,ffdfbf,c0aede,b6e3f4`;
}
