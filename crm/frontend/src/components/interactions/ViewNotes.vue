<script setup lang="ts">
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';

const props = defineProps(['interactionDetails'])
</script>

<template>
    <Dialog>
        <DialogTrigger @click.stop>
            View Notes
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Interaction Notes</DialogTitle>
            <DialogDescription>
                The notes saved for the interaction
            </DialogDescription>
        </DialogHeader>
            <p>{{ props.interactionDetails.notes }}</p>
        </DialogContent>
    </Dialog>
</template>