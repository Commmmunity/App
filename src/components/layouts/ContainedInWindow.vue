<template>
  <div
    ref="superContainer"
    class="containedinwindow"
    :style="{ height: getHeight + 'px' }"
    :class="[{ 'containedinwindow--ready': isReady }]"
  >
    <div class="containedinwindow__container" ref="container">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ContainedInWindow",
  props: {
    reference: {
      required: true
    },
    superposition: {
      required: false,
      default: false
    },
    bus: null
  },
  data: function(params) {
    return {
      windowHeight: null,
      containerHeight: null,
      isReady: false,
      top: null
    };
  },
  computed: {
    getHeight: function(params) {
      return this.containerHeight;
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
    this.bus.$on("refresh", this.onRefresh);
    this.bus.$on("focus", this.onFocus);
    this.windowHeight = window.innerHeight;
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
    this.bus.$off("focus", this.onFocus);
    this.bus.$off("refresh", this.onRefresh);
  },
  mounted() {
    this.refreshHeight();
    this.isReady = true;
  },
  methods: {
    ...mapActions({}),
    onRefresh: function(params) {
      this.$nextTick(() => {
        this.refreshHeight();
      });
    },
    onFocus: function() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.superContainer.scrollTo(0, 0);
        }, 10);
      });
    },
    onResize: function(params) {
      this.windowHeight = window.innerHeight;
      this.refreshHeight();
    },
    onScroll: function(params) {
      this.refreshHeight();
    },
    refreshHeight: function() {
      if (!this.reference) return;
      var posY = this.reference.getBoundingClientRect().top;

      if (!this.superposition)
        posY += this.reference.getBoundingClientRect().height;
      else this.$refs.superContainer.style.top = "0px";

      /*
      if (this.$refs.element.getBoundingClientRect().y < 20) this.top = "auto";
      else this.top = "0px";*/

      var borderTop = window.getComputedStyle(this.$refs.superContainer)
        .borderTopWidth;
      var borderBottom = window.getComputedStyle(this.$refs.superContainer)
        .borderBottomWidth;

      var totalBorder =
        parseInt(borderTop.replace("px", "")) +
        parseInt(borderBottom.replace("px", ""));

      this.$nextTick(() => {
        if (posY + this.$refs.container.offsetHeight < this.windowHeight)
          this.containerHeight =
            this.$refs.container.offsetHeight + totalBorder;
        else this.containerHeight = this.windowHeight - posY - 20 + totalBorder;
      });
    }
  },
  watch: {
    reference: function(params) {
      this.refreshHeight();
    }
  }
};
</script>

<style lang="scss" scoped>
.containedinwindow {
  visibility: hidden;
  position: absolute;
  z-index: 2;
  overflow-y: hidden;

  &--ready {
    visibility: visible;
  }
}
</style>
