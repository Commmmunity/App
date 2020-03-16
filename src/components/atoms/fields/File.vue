<template>
  <div class="file">
    <div v-show="preview" :style="{backgroundImage: 'url(' + preview + ')'}" class="file__preview">
      <div class="file__remove" v-on:click="onRemove"></div>
    </div>
    <div
      class="file__upload"
      ref="dropzone"
      v-on:click="addFile"
      :class="[{'file__upload--highlight': dropzoneHightlight}]"
    >Déposez ici votre fichier</div>
    <input
      v-show="false"
      :id="id"
      :name="name"
      type="file"
      :disabled="disable"
      ref="selecter"
      v-on:change="handleFileUpload()"
    />
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
    message: {},
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
      preview: null,
      dropzoneHightlight: false
    };
  },
  computed: {},
  methods: {
    ...mapActions({}),
    handleFileUpload: function(file) {
      if (!file) this.file = this.$refs.selecter.files[0];
      else this.file = file;

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
    },
    addFile: function() {
      this.$refs.selecter.click();
    },
    preventDefaults: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    highlight: function() {
      this.dropzoneHightlight = true;
    },
    unhighlight: function() {
      this.dropzoneHightlight = false;
    },
    drop: function(e) {
      let dt = e.dataTransfer;
      let files = dt.files;

      if (Object.entries(files).length > 0) this.handleFileUpload(files["0"]);
    },
    onRemove: function() {
      this.theValue = null;
      this.preview = null;
    }
  },
  created() {
    this.theValue = this.value;
  },
  mounted: function() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      this.$refs.dropzone.addEventListener(
        eventName,
        this.preventDefaults,
        false
      );
    });
    ["dragenter", "dragover"].forEach(eventName => {
      this.$refs.dropzone.addEventListener(eventName, this.highlight, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
      this.$refs.dropzone.addEventListener(eventName, this.unhighlight, false);
    });

    this.$refs.dropzone.addEventListener("drop", this.drop, false);
  },
  destroyed: function() {
    if (this.$refs.dropzone !== undefined) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        this.$refs.dropzone.removeEventListener(
          eventName,
          this.preventDefaults,
          false
        );
      });

      ["dragenter", "dragover"].forEach(eventName => {
        this.$refs.dropzone.removeEventListener(
          eventName,
          this.highlight,
          false
        );
      });

      ["dragleave", "drop"].forEach(eventName => {
        this.$refs.dropzone.removeEventListener(
          eventName,
          this.unhighlight,
          false
        );
      });

      this.$refs.dropzone.removeEventListener("drop", this.drop, false);
    }
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

<style lang="scss" scoped>
.file {
  @include flex;
}
.file__preview {
  @include field;
  margin-right: $margin-small;
  border: none;
  width: 20%;
  min-width: 150px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}
.file__upload {
  @include field;
  border-style: dashed;
  background-color: transparent;
  text-align: center;
  cursor: pointer;

  &--highlight {
    background-color: $color-main;
  }
}

.file__remove {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 26px;
  height: 26px;
  @include icon-remove;
  cursor: pointer;
}
</style>
