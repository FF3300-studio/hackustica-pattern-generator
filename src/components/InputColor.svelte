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
  import InputRadio from "./InputRadio.svelte";
  import ColorDropdown from "./ColorDropdown.svelte";
  import ColorInteger from "./ColorInteger.svelte";
  import InputSelect from "./InputSelect.svelte";

  // TS / Logic
  import { Tiles, ColorModes, GradientPositions } from "../ts/defs";
  import InputSeparator from "./InputSeparator.svelte";

  /**
   * Parameters
   */

  export let scope: string;
  export let gradient: boolean = false;

  /**
   * Logic
   */

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  // Removing gradient if asked
  const modes = [...ColorModes];
  if (!gradient) {
    modes.splice(modes.indexOf("gradient"), 1);
  }

  // Creating array for select
  const gradientpos: Array<{ value: string | number; text: string }> = [];
  for (let gp of GradientPositions) {
    gradientpos.push({
      value: gp,
      text: $TextStore.gradient_positions[gp],
    });
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
  <InputRadio
    on:update={dispatchUpdate}
    bind:value={$PatternStore.color[scope].mode}
    items={modes}
    labels={$TextStore.color_modes}
  />
</InputItem>

<InputSeparator />

<!-- If colormode is tile, we set color for each tile -->
<div class="mt-2">
  {#if $PatternStore.color[scope].mode == "tile"}
    {#each Tiles as t}
      <ColorDropdown
        label={$TextStore.tiles[t]}
        bind:color={$PatternStore.color[scope].tile[t]}
        on:update={dispatchUpdate}
      />
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
  {:else if $PatternStore.color[scope].mode == "gradient"}
    <ColorDropdown
      label="Colore 1"
      bind:color={$PatternStore.color[scope].gradient.first.color}
      on:update={dispatchUpdate}
    />
    <!--  -->
    <InputItem>
      <InputSelect
        values={gradientpos}
        bind:value={$PatternStore.color.background.gradient.first.position}
        on:update={dispatchUpdate}
        label="Posizione"
      />
    </InputItem>
    <!--  -->
    <ColorDropdown
      label="Colore 2"
      bind:color={$PatternStore.color[scope].gradient.second.color}
      on:update={dispatchUpdate}
    />
    <!--  -->
    <InputItem>
      <InputSelect
        values={gradientpos}
        bind:value={$PatternStore.color.background.gradient.second.position}
        on:update={dispatchUpdate}
        label="Posizione"
      />
    </InputItem>
  {/if}
</div>

<style>
  .mt-2 {
    margin-top: var(--aria);
  }
</style>
