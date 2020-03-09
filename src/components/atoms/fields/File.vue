<template>
  <div class="file">
    <input
      :id="id"
      :name="name"
      type="file"
      :disabled="disable"
      ref="selecter"
      v-on:change="handleFileUpload()"
    />
    <img v-show="preview" :src="preview" height="50" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FieldFile",
  props: {
    id: {
      required: true,
      type: String
    },
    name: {
      required: false,
      type: String
    },
    value: {
      required: true
    },
    description: {
      type: String,
      required: false
    },
    label: {
      type: String,
      default: ""
    },
    disable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    }
  },
  data: function() {
    return {
      theValue: null,
      file: null,
      preview: null
    };
  },
  computed: {},
  methods: {
    ...mapActions({}),
    handleFileUpload: function() {
      this.file = this.$refs.selecter.files[0];

      if (
        this.file !== undefined &&
        typeof this.file.type !== "undefined" &&
        this.file.type.indexOf("image") >= 0
      ) {
        var reader = new FileReader();

        reader.onload = e => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.file);
      }

      if (!this.file) {
        this.theValue = null;
        this.preview = null;
      } else
        this.theValue = {
          type: this.file.type,
          size: this.file.size,
          file: this.file
        };
    }
  },
  created() {
    this.theValue = this.value;
  },
  watch: {
    theValue: function() {
      this.$emit("input", this.theValue);
    },
    value: function() {
      this.theValue = this.value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
