<script lang="ts">
  // Svelte imports
  import InputItem from "./InputItem.svelte";
  import InputInteger from "./InputInteger.svelte";
  import InputFloat from "./InputFloat.svelte";
  import InputCRUD from "./InputCRUD.svelte";
  import InputRadio from "./InputRadio.svelte";
  import InputFile from "./InputFile.svelte";
  import InputSeparator from "./InputSeparator.svelte";

  // Stores with data
  import { PatternStore, TextStore } from "../stores";

  // Functions & defs
  import { handleDraw } from "../ts/draw";
  import { ThicknessModes } from "../ts/defs";
</script>

<!-- Radio buttons to select the thickness mode -->
<InputItem>
  <InputRadio
    on:update={handleDraw}
    bind:value={$PatternStore.thickness.mode}
    items={[...ThicknessModes].reverse()}
    labels={$TextStore.thickness_modes}
  />
</InputItem>
<!--  -->
<InputSeparator />
<!--  -->
{#if $PatternStore.thickness.mode == "image"}
  <InputItem>
    <InputFile
      on:upload={(e) => {
        $PatternStore.thickness.image.url = e.detail.file;
        handleDraw();
      }}
    />
  </InputItem>
  <!--  -->
  <InputItem>
    <InputInteger
      label="Numero di step"
      bind:value={$PatternStore.thickness.image.steps}
      on:update={handleDraw}
    />
  </InputItem>
  <!--  -->
  <InputItem>
    <InputFloat
      label="Spessore minimo"
      bind:value={$PatternStore.thickness.image.min}
      on:update={handleDraw}
    />
  </InputItem>
  <!--  -->
  <InputItem>
    <InputFloat
      label="Spessore massimo"
      bind:value={$PatternStore.thickness.image.max}
      on:update={handleDraw}
    />
  </InputItem>
{:else}
  <InputItem>
    <InputCRUD
      on:update={handleDraw}
      bind:array={$PatternStore.thickness.values}
    />
  </InputItem>
{/if}
