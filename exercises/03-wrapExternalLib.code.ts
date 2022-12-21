import { fetchUser } from "external-lib";

export const fetchUserWithFullName = async (
  ...args: Parameters<typeof fetchUser>
): Promise<Awaited<ReturnType<typeof fetchUser>> & { fullName: string }> => {
  const user = await fetchUser(...args);
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

// Parameters 유틸리티 타입을 쓰면 해당 타입의 배열화 되네..
// returntype은 리턴타입을 타입으로 만들어주네..

type ExFunc = ({hello}: {hello: number }) => {chris: string};

type Ptype = Parameters<ExFunc>;
//[{hello: number}]

type Rtype = ReturnType<ExFunc>;
// {chris: string}