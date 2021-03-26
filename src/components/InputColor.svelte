<script lang="ts">
  /**
   * Imports
   */

  import { DefaultColorsStore, PatternStore, TextStore } from "../stores";
  import { createEventDispatcher } from "svelte";

  // Modules
  import { nanoid } from "nanoid";

  // Svelte
  import InputItem from "./InputItem.svelte";
  import InputInteger from "./InputInteger.svelte";
  import ColorDropdown from "./ColorDropdown.svelte";
  import ColorInteger from "./ColorInteger.svelte";

  // TS / Logic
  import { Tiles, ColorModes } from "../ts/app/defs";
  import { Color } from "paper/dist/paper-core";

  // // TS / UI
  // import type { ColorConfig } from "../ts/ui/configs";
  // import { tiles_text, colorModes_text } from "../ts/ui/text";

  /**
   * Parameters
   */

  export let scope: string;

  /**
   * Logic
   */

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  // IDs for select
  const ids = {
    line: nanoid(5),
    wave: nanoid(5),
    peak: nanoid(5),
  };
</script>

<!-- Radio buttons to select the color mode -->
<InputItem>
  {#each ColorModes as cm}
    <label class="radio">
      <input
        type="radio"
        on:change={dispatchUpdate}
        bind:group={$PatternStore.color[scope].mode}
        value={cm}
      />
      {$TextStore.color_modes[cm]}
    </label>
  {/each}
</InputItem>

<!-- If colormode is tile, we set color for each tile -->
{#if $PatternStore.color[scope].mode == "tile"}
  {#each Tiles as t}
    <InputItem>
      <label for={ids[t]}>{$TextStore.tiles[t]}</label>
      <ColorDropdown
        bind:color={$PatternStore.color[scope].tile[t]}
        on:update={dispatchUpdate}
      />
    </InputItem>
  {/each}
  <!-- If colormode is distribution, for each color we specify its distribution -->
{:else if $PatternStore.color[scope].mode == "distribution"}
  {#each $DefaultColorsStore as color}
    <InputItem>
      <ColorInteger
        {color}
        on:update={dispatchUpdate}
        bind:value={$PatternStore.color[scope].distribution[color]}
      />
    </InputItem>
  {/each}
{/if}

<style>
  .radio {
    display: flex;
    flex-flow: row nowrap;
  }
</style>
