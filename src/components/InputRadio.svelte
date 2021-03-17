<script lang="ts">
  export let value: any;
  export let list: Array<{ value: any; text: string }>;
</script>

{#each list as item}
  <label>
    <input type="radio" bind:group={value} value={item.value} />
    {item.text}
  </label>
{/each}
