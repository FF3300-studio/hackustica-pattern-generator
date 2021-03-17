<script lang="ts">
  export let id: string;
  export let list: Array<{ value: any; text: string }>;
  export let def: number = 0;
</script>

<select name={id} {id}>
  {#each list as item, index}
    <option value={item.value} selected={index == def ? true : undefined}
      >{item.text}</option
    >
  {/each}
</select>
