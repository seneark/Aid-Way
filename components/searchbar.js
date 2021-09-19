import React, { Component, Fragment } from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Block } from 'galio-framework';
var items = [
  {
    id: 1,
    name: 'Manthan Garg',
  },
  {
    id: 2,
    name: 'Puneet Kumar',
  },
  {
    id: 3,
    name: 'Raghu Chaturvedi',
  },
  {
    id: 4,
    name: 'Mrdul Chatu rvedi',
  },
  {
    id: 5,
    name: 'Manan Grover',
  },
  {
    id: 6,
    name: 'Naveen Kumar',
  },
  {
    id: 7,
    name: 'Rajat Kumar',
  },
  {
    id: 8,
    name: 'Naman Gupta',
  },
];
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: []
    }
  }
  render() {
  return (
        <Fragment>
          {/* Multi */}
          <Block center>

          <SearchableDropdown
            multi={true}
            selectedItems={this.state.selectedItems}
            onItemSelect={(item) => {
              const items = this.state.selectedItems;
              items.push(item)
              this.setState({ selectedItems: items });
            }}
            containerStyle={{ padding: 5,width: 380,height: 500}}
            onRemoveItem={(item, index) => {
              const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
              this.setState({ selectedItems: items });
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={items}
            defaultIndex={0}
            chip={true}
            resetValue={false}
            textInputProps={
              {
                
                placeholder: "Select Officials",
                underlineColorAndroid: "transparent",
                style: {
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    borderColor: "#bbb",
                    borderWidth: 1,
                    
                },
               
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
                
              }
            }
          />
          </Block>
         
      </Fragment>
  );
  }
}
export default SearchBar;
