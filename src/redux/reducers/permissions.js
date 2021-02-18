const permissionInit = {
  existRoute: [],
  existMenu: []
}

export default function (state = permissionInit, action) {
  switch (action.type) {
    case 'SET_PERMISSION':
      return {
        ...state,
        ...action.payload || {}
      }
      break;
    default:
      return {
        ...state
      }
      break;
  }
}