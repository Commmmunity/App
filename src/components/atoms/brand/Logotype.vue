<template>
  <div class="logotype">
    <img
      src="@/assets/images/brand/communities-cooking__logotype.svg"
      class="logotype__image"
    />
  </div>
</template>

<script>
export default {
  name: "Logotype"
};
</script>

<style lang="scss" scoped>
.logotype {
  @include flex;
  align-items: center;
  font-size: 1em;
  font-weight: $font-weight-black;
}

.logotype__image {
  height: 2.5em;
  margin-right: 0.3em;
}
</style>
