class ShareSerializer < ActiveModel::Serializer
  attributes :id, :recipe_id, :user_id, :friend_id
end
