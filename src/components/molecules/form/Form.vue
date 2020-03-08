<template>
  <div class="form">
    <div class="form__group" v-for="(group, groupId) in fields" :key="groupId">
      <Field
        v-for="(field, index) in group.fields"
        :key="index"
        :id="field.id"
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :errors="errors[index]"
        v-model="values[index]"
      />
    </div>
  </div>
</template>

<script>
import Field from "../../atoms/fields/Field.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Form",
  components: {
    Field
  },
  props: {
    fields: {
      type: Object,
      required: true
    },
    errors: null
  },
  data: function() {
    return {
      values: {}
    };
  },
  computed: {},
  methods: {},
  watch: {
    values: function() {
      this.$emit("update", this.values);
    }
  }
};
</script>

<style lang="scss" scoped></style>
