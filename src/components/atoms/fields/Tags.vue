<template>
  <div class="tags">
    <header
      class="tags__header"
      :class="[{'tags__header--with-indication': optionsQuantity && optionsQuantity !== -1}]"
    >
      <div class="tags__search">
        <input class="search__input" type="text" :placeholder="placeholder" v-model="filter" />
        <span class="search__remove" v-show="filter && filter !== ''" v-on:click="filter = null"></span>
      </div>
      <p class="tags__indication" v-if="optionsQuantity && optionsQuantity !== -1">
        {{ optionsQuantity }} choix maximum,
        <span
          v-if="theValue.length >= 0 && optionsQuantity - theValue.length > 0"
        >
          encore
          <strong>{{ optionsQuantity - theValue.length }} choix</strong>
        </span>
        <strong v-else-if="theValue.length >= 0">c'est fait !</strong>
      </p>
    </header>
    <div class="tags__options" v-if="getOption.length > 0 || Object.entries(getOption).length > 0">
      <div
        class="tags__option"
        :class="[{ 'tags__option--selected': theValue.includes(option.value) }, 'tags__option--' + getVariation]"
        v-for="(option, index) in getOption"
        :key="index"
        v-on:click="onChoice(option)"
      >
        <div class="option__container">
          <div class="option__image" v-if="option.image">
            <img :src="option.image" />
          </div>

          <div class="option__label">
            <div>
              {{
              option.label
              }}
            </div>
            <div class="option__description" v-if="option.description">{{option.description}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="tags__search--nothing">🕵🏽‍♀️ Rien de ne correspond à votre recherche</div>
  </div>
</template>

<script>
import Icon from "../icons/Icon.vue";
import { mapGetters, mapActions } from "vuex";
import FieldTag from "./Tag";
import debounce from "lodash.debounce";

export default {
  name: "FieldTags",
  components: {
    Icon,
    FieldTag
  },
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
    options: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
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
    },
    optionsQuantity: {
      required: false,
      default: -1
    },
    optionsSearch: {
      required: false,
      default: null,
      type: Function
    },
    optionsSearchMapping: {
      required: false,
      default: null,
      type: Object
    },
    variation: {
      type: String,
      default: "inline",
      validator: function(value) {
        if (!value) return true;

        return ["inline", "block", "user"].indexOf(value) !== -1;
      }
    }
  },
  data: function() {
    return {
      theValue: [],
      filter: null,
      debouncedSearch: null,
      optionsFromSearch: [],
      optionsCached: [],
      selected: false
    };
  },
  computed: {
    getVariation: function() {
      if (!this.variation) return "inline";
      return this.variation;
    },
    getOption: function() {
      // Le search est réalisé par une fonction tierce
      if (this.optionsSearchMapping) {
        var optionsWithoutAlreadySelect = this.optionsFromSearch.filter(
          option => {
            if (this.theValue.indexOf(option.id) !== -1) return false;
            return true;
          }
        );
        return { ...this.optionsCached, ...this.optionsFromSearch };
      }

      // Le search est réalisé par un filtre sur un array
      var options = this.options.filter(option => {
        if (
          this.filter &&
          !option.label.toLowerCase().includes(this.filter.toLowerCase())
        )
          return false;

        return true;
      });

      return options;
    }
  },
  methods: {
    ...mapActions({}),
    onFocus: function() {
      this.$emit("focus");
    },
    onBlur: function() {
      this.$emit("blur");
    },
    onChoice: function(option) {
      if (
        this.optionsQuantity &&
        this.optionsQuantity !== -1 &&
        this.theValue.length >= this.optionsQuantity
      ) {
        if (this.theValue.includes(option.value)) return this.onRemove(option);
        else return;
      }

      if (!this.theValue.includes(option.value)) {
        this.theValue.push(option.value);

        // On ajoute l'option sélectionnée dans le cache pour pouvoir l'afficher si les options proposées n'incluent plus une option déja sélectionnée
        var found = false;
        for (var i = 0; i < this.optionsCached.length; i++) {
          if (
            this.optionsCached[i].value !== undefined &&
            this.optionsCached[i].value == option.value
          ) {
            found = true;
            break;
          }
        }

        if (!found) this.optionsCached.push(option);
      } else {
        this.onRemove(option);
      }
    },
    onRemove: function(option) {
      if (this.theValue.includes(option.value))
        this.theValue.splice(this.theValue.indexOf(option.value), 1);

      var found = false;
      for (var i = 0; i < this.optionsCached.length; i++) {
        if (
          this.optionsCached[i].value !== undefined &&
          this.optionsCached[i].value == option.value
        ) {
          this.optionsCached.splice(i, 1);

          break;
        }
      }
    },
    search: function() {
      if (!this.optionsSearch) return;

      this.optionsSearch(this.filter)
        .then(hits => {
          if (this.optionsSearchMapping) {
            this.optionsFromSearch = [];
            hits.forEach(hit => {
              var data = {
                id: this.optionsSearchMapping.id(hit),
                value: this.optionsSearchMapping.value(hit),
                label: this.optionsSearchMapping.label
                  ? this.optionsSearchMapping.label(hit)
                  : null,
                description: this.optionsSearchMapping.description
                  ? this.optionsSearchMapping.description(hit)
                  : null,
                image: this.optionsSearchMapping.image
                  ? this.optionsSearchMapping.image(hit)
                  : null
              };

              this.optionsFromSearch.push(data);
            });
          } else {
            this.options = hits;
          }
        })
        .catch(err => {});
    }
  },
  created() {
    if (this.value) this.theValue = this.value;
    if (this.optionsSearch) this.search();
    this.debouncedSearch = debounce(this.search, 200);
  },
  watch: {
    theValue: function() {
      this.$emit("input", this.theValue);
    },
    value: function() {
      this.theValue = this.value;
    },
    filter: function() {
      this.debouncedSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.search__input {
  @include field($type: "search", $size: "small");
}

.tags__header {
  @include flex;
  align-items: center;
  margin-top: $margin-large;
}

.tags__indication {
  @include text-small;
  margin-left: $main-size;
  text-align: right;
  flex-grow: 1;

  strong {
    @include text-small-extrabold;
  }
}

.tags__option {
  @include text-small;
  @include icon-checkbox;
  background-position: right;
  background-size: 2rem;
  background-color: transparent;
  border: $color-text $border-width-m solid;
  border-radius: $border-radius;
  padding: 0.5rem 1rem;
  padding-right: 2.5rem;
  margin: 0 8px 12px 0;

  display: inline-block;
  cursor: pointer;

  transition: background-color 0.2s;

  &:hover {
    background-color: $color-background;
  }

  .option__container {
    @include flex;
    align-items: center;
  }

  .option__image {
    height: 40px;
    width: 40px;
    margin-right: $margin-small;
    margin-left: -0.5rem;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .option__description {
    @include text-small;
  }

  &--selected {
    background-color: $color-secondary !important;
    @include icon-checkbox($status: active);
    color: $color-white !important;
  }

  &--block {
    display: block;
    margin-right: 0px;
  }

  &--user {
    display: block;
    @include field-text;
    margin-right: 0px;

    .option__image {
      @include avatar;
    }
  }
}

.tags__options {
  max-height: 300px;
  overflow: scroll;
  margin-top: $margin-default;
  margin-bottom: $margin-large;
}

.tags__search {
  position: relative;
  flex-basis: 100%;

  .tags__header--with-indication & {
    flex-basis: 400px;
  }
}

.search__remove {
  @include icon-remove;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.5rem;
  z-index: 1;
  height: 30px;
  width: 30px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
  cursor: pointer;
}

.tags__search--nothing {
  margin-top: $margin-large;
  margin-bottom: $margin-large;
  text-align: center;
  @include text-body-black;
}
</style>
