import React from 'react';
import styles from './Favourites.css';
import cssModules from 'react-css-modules';
import Favourite from '../person/Person.jsx';
import Title from '../title/Title.jsx';
import {SortableItems, SortableItem} from 'react-sortable-component';
import FavouriteStore from '../../stores/FavouriteStore';
import PeopleSearchActions from '../../actions/PeopleSearchActions';

function getStoreFavouriteState() {
  return {
    favourites: FavouriteStore.getCurrentFavourites(),
  };
}

class Favourites extends React.Component {
  constructor(props) {
    super(props);

    PeopleSearchActions.getFavourites();

    this.state = getStoreFavouriteState();
  }

  componentWillMount() {
    FavouriteStore.removeChangeListener(this.onFavourite);
  }

  componentDidMount() {
    FavouriteStore.addChangeListener(this.onFavourite.bind(this));
  }

  onFavourite() {
    const pinned = getStoreFavouriteState();

    this.props.onFavouritesChange(pinned.favourites);
  }

  onItemUpdate(index, favourites, isFavourite) {
    const element = Number(index.slice(1));

    this.props.onItemUpdate(element, isFavourite, 'favourite');
  }

  getCommandButtonsAvailable(current) {
    return current.some(function(el) {
      return el.label === 'Documents' || el.label === 'Everything' || el.label === 'Export to Outlook' || el.label === 'Yammer';
    });
  }

  getFavouritesHolder() {
    if (this.props.favourites.length > 0) {
      return (
        <div key="sortable-favourite-container" styleName="sortable-favourite-container">
          <SortableItems
            name="sort-favourites"
            items={this.props.favourites}
            onSort={this.handleFavouriteSort}>
                {this.props.favourites.map(this.createDraggablePinItem.bind(this))}
          </SortableItems>
        </div>
      );
    }
  }

  createEmptyResultsMessage(count) {
    if (count === 0) {
      return (
        <p key="no-favourites">
          Well this is embarrassing, you do not seem to have any friends. <br /><br />Favourite some people now before anyone notices.
        </p>
      );
    }
  }

  createDraggablePinItem(item, i) {
    return (
      <SortableItem key={item.name}>
        <div styleName="sortable-item-content" style={this.itemStyles}>
          <Favourite
              data={item}
              layout={this.props.layout}
              favourites={this.props.favourites}
              onFavouritesChange={this.onFavourite.bind(this)}
              onItemUpdate={this.onItemUpdate.bind(this)}
              id={'f' + i} />
        </div>
      </SortableItem>
    );
  }

  handleFavouriteSort(favourites) {
    PeopleSearchActions.updateFavourites(
      favourites
    );
  }

  render() {
    const favouritesComponentStyles = {
      display: 'none !important',
    };

    this.itemStyles = this.getCommandButtonsAvailable(this.props.layout.current) ? { paddingBottom: '50px' } : { paddingBottom: '0' };

    return (
      <div key="favourites-manager" id="component-favourites" styleName="component" style={favouritesComponentStyles}>
        <div styleName="container">
          <Title
            text={this.props.title}
            suffix="Favourites" />
        </div>
        <div className="content">
            {this.getFavouritesHolder()}

            {this.createEmptyResultsMessage(this.props.favourites.length)}
        </div>
      </div>
    );
  }
}

Favourites.propTypes = {
  onFavouritesChange: React.PropTypes.func,
  onItemUpdate: React.PropTypes.func,
  title: React.PropTypes.string,
  layout: React.PropTypes.object,
  favourites: React.PropTypes.array,
};

export default cssModules(Favourites, styles, { allowMultiple: true });
