<template>
	<div>
		<B :aDetail="aDetail" :tableData="tableData"></B>
		<p v-for="item in tableData" :key="item.id" ref="items">
			{{ item.label }}：{{ item.id }}
		</p>
	</div>
</template>

<script >
import B from "@/test_vue2/B.vue";
export default {
	components: {
		B,
	},
	data() {
		return {
			aDetail: { b: 4343 },
			tableData: [
				{
					label: 1,
					id: "你",
				},
				{
					label: 2,
					id: "好",
				},
				{
					label: 4,
					id: "界",
				},
                {
					label: 3,
					id: "世",
				},
			],
		};
	},
	mounted() {
		console.log(this.$refs.items);
	}
};
</script>

<style scoped>
</style>