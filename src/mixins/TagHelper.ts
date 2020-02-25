import Vue from 'vue';
import Component from 'vue-class-component'


@Component
class TagHelper extends Vue {
  createTag() {
    console.log('here');

    const name = window.prompt("请输入标签名");
    if (name) {
      this.$store.commit("createTag", name);
    }
  }
}

export default TagHelper