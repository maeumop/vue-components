<script setup lang="ts">
  import { mdiGoogleCirclesExtended } from '@/assets/svg/iconPath';
  import type { VNode } from 'vue';
  import { computed, h, reactive } from 'vue';
  import type { StyledButtonProps } from './types';

  const emit = defineEmits<{
    (event: 'click', value: MouseEvent): void;
  }>();

  const props = withDefaults(defineProps<StyledButtonProps>(), {
    href: '#',
    target: '_blank',
    text: false,
    right: false,
    block: false,
    onlyIcon: false,
    loading: false,
    disabled: false,
    iconRight: false,
    small: false,
    outline: false,
    tag: 'a',
    dropMenuToggle: false,
  });

  const buttonStyle = computed<any>(() => {
    const type = (props.onlyIcon && 'icon') || (props.text && 'text') || 'button';

    return [
      'btn',
      type,
      !props.outline && props.color,
      !props.onlyIcon && props.icon ? (props.iconRight ? 'right' : 'left') : '',
      {
        large: props.large,
        small: props.small,
        xsmall: props.xSmall,
        block: !props.small && !props.xSmall && props.block,
        outline: props.outline,
      },
      props.class,
    ];
  });

  const hrefState = computed<string>(() => {
    if (!props.disabled) {
      return props.href ? props.href : '#';
    }

    return '';
  });

  const iconSize = computed<string>(() => {
    if (props.text) {
      return props.text ? '18' : '22';
    }

    if (props.large) {
      return '24';
    } else if (props.small) {
      return '18';
    } else if (props.xSmall) {
      return '16';
    }

    return '20';
  });

  const options = reactive<any>({
    class: buttonStyle.value,
    onClick: (event: MouseEvent): void => {
      if (props.href === '#') {
        event.preventDefault();

        if (!props.disabled && !props.loading) {
          emit('click', event);
        }
      }
    },
  });

  if (props.tag.toLowerCase() === 'a') {
    options.href = hrefState.value;
    options.target = props.target;
  } else if (props.tag.toLowerCase() === 'button') {
    options.type = 'button';
  }

  const WrapperTag = computed<VNode>(() => h(props.text ? 'a' : props.tag, options));
</script>

<template>
  <WrapperTag :class="{ disabled: props.disabled || props.loading }">
    <div class="btn-wrap">
      <template v-if="!props.onlyIcon">
        <template v-if="props.loading">
          <SvgIcon class="loading" type="mdi" :path="mdiGoogleCirclesExtended" />
        </template>
        <template v-else>
          <template v-if="props.icon">
            <SvgIcon
              type="mdi"
              :class="{ rotate: props.dropMenuToggle }"
              :size="iconSize"
              :path="props.icon"
              v-if="props.icon && !props.iconRight"
            />

            <slot></slot>

            <SvgIcon
              type="mdi"
              :class="{ rotate: props.dropMenuToggle }"
              :size="iconSize"
              :path="props.icon"
              v-if="props.icon && props.iconRight"
            />
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </template>
      </template>
      <template v-else>
        <div class="only-icon">
          <SvgIcon type="mdi" :size="iconSize" :path="props.icon" />
        </div>
      </template>
    </div>
  </WrapperTag>
</template>

<style scoped lang="scss">
  @import './style';
</style>
<script lang="ts">
  export default { name: 'StyledButton' };
</script>
