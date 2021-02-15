const permissionInit = {
  existRoute: [],
  existMenu: []
}

export default function(state = permissionInit, action) {
  const permission = action.payload || {}
  return {
    ...state,
    ...permission
  }
}