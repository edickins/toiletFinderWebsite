/* eslint-disable @typescript-eslint/no-explicit-any */
export enum FiltersActionEnum {
  SHOW_FILTER_PANEL = 'SHOW_FILTER_PANEL',
  HIDE_FILTER_PANEL = 'HIDE_FILTER_PANEL',
  FILTER_BUTTON_CLICK = 'FILTER_BUTTON_CLICK',
  FAVOURITES_BUTTON_CLICK = 'FAVOURITES_BUTTON_CLICK',
  SEARCH_TERM_CHANGE = 'SEARCH_TERM_CHANGE',
  SEARCH_TERM_CLICK = 'SEARCH_TERM_CLICK'
}
interface SearchTermChange {
  type: FiltersActionEnum.SEARCH_TERM_CHANGE;
}

interface SearchTermClick {
  type: FiltersActionEnum.SEARCH_TERM_CLICK;
}

interface ShowFilterPanel {
  type: FiltersActionEnum.SHOW_FILTER_PANEL;
}

interface HideFilterPanel {
  type: FiltersActionEnum.HIDE_FILTER_PANEL;
}

interface FilterButtonClick {
  type: FiltersActionEnum.FILTER_BUTTON_CLICK;
}

interface FavouritesButtonClick {
  type: FiltersActionEnum.FAVOURITES_BUTTON_CLICK;
}

export type FiltersActionType =
  | SearchTermChange
  | SearchTermClick
  | ShowFilterPanel
  | HideFilterPanel
  | FilterButtonClick
  | FavouritesButtonClick;
