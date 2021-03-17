<script lang="ts">
  import InputInteger from "./InputInteger.svelte";
  import InputItem from "./InputItem.svelte";
  import InputRadio from "./InputRadio.svelte";
  import InputSelect from "./InputSelect.svelte";

  export let colors: Array<{ value: string; text: string }>;
  export let color_mode: string;
  export let color_modes: Array<{ value: string; text: string }>;
  export let tiles: Array<{ value: string; text: string; color: number }>;

  export let cd = [1, 2, 3, 4, 5];
</script>

<InputItem>
  <InputRadio bind:value={color_mode} list={color_modes} />
</InputItem>

{#if color_mode == color_modes[0].value}
  <InputItem>
    {#each tiles as tile}
      <label for={color_mode}>{tile.text}</label>
      <InputSelect id={color_mode} list={colors} def={tile.color} />
    {/each}
  </InputItem>
{:else if color_mode == color_modes[1].value}
  {#each colors as color, index}
    <InputItem>
      <label for={"bg-" + color.value}>{color.text}</label>
      <InputInteger id={"bg-" + color.value} bind:value={cd[index]} />
    </InputItem>
  {/each}
{/if}
