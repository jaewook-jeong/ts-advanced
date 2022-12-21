const userAccessModel = {
  user: ["update-self", "view"],
  admin: ["create", "update-self", "update-any", "delete", "view"],
  anonymous: ["view"],
} as const;

export type Role = keyof typeof userAccessModel;
// 이렇게 하면 배열인 키의 모든 값을 알 수 있다.
export type Action = typeof userAccessModel[Role][number];


export const canUserAccess = (role: Role, action: Action) => {
  return (userAccessModel[role] as ReadonlyArray<Action>).includes(action);
};
