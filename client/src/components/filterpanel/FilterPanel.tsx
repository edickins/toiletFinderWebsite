import FilterPanelNav from './FilterPanelNav';
import FiltersContainer from './FiltersContainer';

type Props = {
  handleFindToiletButtonClick: () => void;
};

function FilterPanel({ handleFindToiletButtonClick }: Props) {
  return (
    <div
      id='filter-panel'
      className=' pointer-events-none absolute left-0  right-0 top-0 md:bottom-12 md:left-48 md:top-16 md:flex md:max-w-md '
    >
      <div className='md:w-full'>
        <FilterPanelNav
          handleFindToiletButtonClick={handleFindToiletButtonClick}
        />
        <FiltersContainer />
      </div>
    </div>
  );
}

export default FilterPanel;
