import SyncLock from '@mui/icons-material/SyncLock'
import Sync from '@mui/icons-material/Sync'
import PublishedWithChanges from '@mui/icons-material/PublishedWithChanges'
import { Badge } from '@mui/material'

export const TodoBadge = (badgeContent: number) => {
  return (
    <Badge badgeContent={badgeContent}>
        <SyncLock style={{ color: '#DE3163' }} />
    </Badge>
  )
}

export const DoingBadge = (badgeContent: number) => {
  return (
    <Badge badgeContent={badgeContent}>
      <Sync style={{ color: '	#50C878' }} />
    </Badge>
  )
}

export const DoneBadge = (badgeContent: number) => {
  return (
    <Badge badgeContent={badgeContent}>
      <PublishedWithChanges style={{ color: '#B1B1EF' }} />
    </Badge>
  )
}