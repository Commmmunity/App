<template>
  <div class="form">
    <div class="form__group" v-for="(group, groupId) in form" :key="groupId">
      <Field
        v-for="(field, index) in group.fields"
        :key="index"
        :id="field.id"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        :type="field.type"
        :instantTouch="field.instantTouch !== null ? field.instantTouch : false"
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
    form: {
      type: Object,
      required: true
    },
    errors: null
  },
  data: function() {
    return {
      init: true,
      values: {}
    };
  },
  created() {
    for (let [groupKey, groupData] of Object.entries(this.form)) {
      for (let [fieldsKey, fieldsData] of Object.entries(groupData)) {
        for (let [fieldKey, fieldData] of Object.entries(fieldsData)) {
          if (fieldData.value)
            this.$set(this.values, fieldKey, fieldData.value);
        }
      }
    }

    this.init = false;
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
