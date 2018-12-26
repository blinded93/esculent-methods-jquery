class MessagesService
  attr_accessor :messages, :scope, :user

  def initialize(params, user)
    @messages = nil
    @scope = params[:scope] == "true" ? "unread" : params[:scope]
    @user = user
  end

  def filter
    messages = self.user.send(user_scope)
    !!message_scope ? messages.send(message_scope) : messages
  end

  def user_scope
    self.scope == "sent" ? "sent_messages" : "received_messages"
  end

  def message_scope
    ["sent", "all"].include?(self.scope) ? nil : self.scope
  end
end
