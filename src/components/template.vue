<template> </template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "---",
  computed: {
    ...mapGetters("auth", ["getLoggedInStatus"])
  },
  methods: {
    ...mapActions({})
  }
};
</script>

<style lang="scss" scoped></style>
