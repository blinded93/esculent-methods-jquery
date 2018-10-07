class MessageSerializer < ActiveModel::Serializer
  attributes :id, :subject, :body, :read_at, :sender_id, :recipient_id
end
