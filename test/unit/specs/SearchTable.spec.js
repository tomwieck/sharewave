import { mount } from 'avoriaz';
import { expect } from 'chai'
import SearchTable from 'src/components/SearchTable.vue';
import Search from 'src/components/Search.vue';
import Vue from 'vue'

describe('SearchTable.vue', () => {
  it('renders a div with class search-table', () => {
    const wrapper = mount(SearchTable);
    expect(wrapper.is('div')).to.equal(true);
    expect(wrapper.hasClass('search-table')).to.equal(true);
  });

  it('Renders table rows when results are provided', () => {
    const searchResults = { 
      previewUrl: 'www.test.com',
      artist: 'test artist',
      track: 'test track',
      album: 'test album',
      artwork: 'www.testart.com',
      url: 'www.url.com'
    };
    const wrapper = mount(SearchTable, { propsData: { searchResults } });
    var vm = new Vue({ component: { Search } })
    vm.$on('parentPlay', function (url, e) {
      expect(url).to.equal('www..com')
    })
    expect(wrapper.find('.preview-link')[0].text().trim()).to.equal('Preview');
    console.log(wrapper.find('.album-art')[0]);
    expect(wrapper.find('.album-art')[0].hasAttribute('src', 'www.testart.com')).to.equal(true);
    // console.log(bus.component.SearchTable);
    button.simulate('click');
    // console.log(bus);
  });
  // it('renders 2 list elements as direct descendants of .parent-ul', () => {
  //   const wrapper = mount(Bar);
  //   const listElements = wrapper.find('.parent-ul > li');
  //   expect(listElements.length).to.equal(2);
  // });

  // it('.child-ul has color style set to red', () => {
  //   const wrapper = mount(Bar);
  //   const childUl = wrapper.find('.child-ul')[0];
  //   expect(childUl.hasStyle('color', 'red')).to.equal(true);
  // });
});

