import { createContext, useContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { PressableProps } from "react-native";

export type FooterActionOptions = {
  title: string;
  onPress: NonNullable<PressableProps["onPress"]>;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
};

type FooterActionSetter = Dispatch<SetStateAction<FooterActionOptions | null>>;

export const FooterActionsContext = createContext<FooterActionSetter | null>(null);

export function useFooterAction(action: FooterActionOptions) {
  const setFooterAction = useContext(FooterActionsContext);

  if (!setFooterAction) {
    throw new Error("useFooterAction must be used inside the editor layout");
  }

  const { title, onPress, disabled, loading, id } = action;

  useEffect(() => {
    setFooterAction({ title, onPress, disabled, loading, id });
  }, [setFooterAction, title, onPress, disabled, loading, id]);

  useEffect(() => () => setFooterAction(null), [setFooterAction]);
}
